import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Act {
  id: string;
  number: string;
  title: string;
  project: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  photos: number;
  certificates: number;
  photoUrls?: string[];
  description?: string;
}

export default function Index() {
  const [acts, setActs] = useState<Act[]>([
    {
      id: '1',
      number: 'АСР-001',
      title: 'Акт на скрытые работы по устройству фундамента',
      project: 'ЖК "Новый горизонт"',
      date: '2024-11-10',
      status: 'approved',
      photos: 8,
      certificates: 3,
      photoUrls: [
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
        'https://images.unsplash.com/photo-1590725140246-20acdee442be?w=800',
        'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800',
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
      ],
      description: 'Выполнено устройство монолитного железобетонного фундамента согласно проектной документации'
    },
    {
      id: '2',
      number: 'АСР-002',
      title: 'Акт на скрытые работы по армированию плиты перекрытия',
      project: 'ЖК "Новый горизонт"',
      date: '2024-11-12',
      status: 'pending',
      photos: 12,
      certificates: 2,
      photoUrls: [
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
        'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=800',
        'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=800',
      ],
      description: 'Армирование плиты перекрытия выполнено арматурой класса А500С'
    },
    {
      id: '3',
      number: 'АСР-003',
      title: 'Акт освидетельствования скрытых работ по гидроизоляции',
      project: 'ТЦ "Метрополис"',
      date: '2024-11-13',
      status: 'approved',
      photos: 6,
      certificates: 4,
      photoUrls: [
        'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800',
        'https://images.unsplash.com/photo-1599619351208-3e6906a4b53d?w=800',
      ],
      description: 'Гидроизоляция выполнена битумно-полимерными материалами'
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [selectedAct, setSelectedAct] = useState<Act | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const stats = {
    total: acts.length,
    approved: acts.filter(a => a.status === 'approved').length,
    pending: acts.filter(a => a.status === 'pending').length,
    rejected: acts.filter(a => a.status === 'rejected').length,
  };

  const exportToExcel = () => {
    const wsData = [
      ['№ акта', 'Наименование', 'Проект', 'Дата', 'Статус', 'Фото', 'Сертификаты'],
      ...acts.map(act => [
        act.number,
        act.title,
        act.project,
        new Date(act.date).toLocaleDateString('ru-RU'),
        act.status === 'approved' ? 'Утвержден' : act.status === 'pending' ? 'На рассмотрении' : 'Отклонен',
        act.photos,
        act.certificates
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Реестр актов');
    
    ws['!cols'] = [
      { wch: 12 },
      { wch: 50 },
      { wch: 25 },
      { wch: 12 },
      { wch: 18 },
      { wch: 8 },
      { wch: 15 }
    ];

    XLSX.writeFile(wb, `Реестр_актов_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    doc.addFont('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf', 'Roboto', 'normal');
    
    const title = 'РЕЕСТР АКТОВ НА СКРЫТЫЕ РАБОТЫ';
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(16);
    doc.text(title, pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Дата формирования: ${new Date().toLocaleDateString('ru-RU')}`, pageWidth / 2, 22, { align: 'center' });

    const tableData = acts.map(act => [
      act.number,
      act.title,
      act.project,
      new Date(act.date).toLocaleDateString('ru-RU'),
      act.status === 'approved' ? 'Утвержден' : act.status === 'pending' ? 'На рассмотрении' : 'Отклонен',
      act.photos.toString(),
      act.certificates.toString()
    ]);

    autoTable(doc, {
      head: [['№ акта', 'Наименование', 'Проект', 'Дата', 'Статус', 'Фото', 'Сертификаты']],
      body: tableData,
      startY: 28,
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [14, 165, 233],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 80 },
        2: { cellWidth: 50 },
        3: { cellWidth: 22 },
        4: { cellWidth: 35 },
        5: { cellWidth: 15 },
        6: { cellWidth: 25 }
      },
      didDrawPage: (data) => {
        doc.setFontSize(8);
        doc.text(
          `Страница ${data.pageNumber}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }
    });

    doc.save(`Реестр_актов_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.pdf`);
  };

  const getStatusBadge = (status: Act['status']) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: 'На рассмотрении', icon: 'Clock' },
      approved: { variant: 'default' as const, label: 'Утвержден', icon: 'CheckCircle2' },
      rejected: { variant: 'destructive' as const, label: 'Отклонен', icon: 'XCircle' },
    };
    const config = variants[status];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon name={config.icon as any} size={12} />
        {config.label}
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего актов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="FileText" size={20} className="text-primary" />
                </div>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Утверждено</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Icon name="CheckCircle2" size={20} className="text-green-600" />
                </div>
                <p className="text-3xl font-bold">{stats.approved}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">На рассмотрении</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-amber-600" />
                </div>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Отклонено</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Icon name="XCircle" size={20} className="text-red-600" />
                </div>
                <p className="text-3xl font-bold">{stats.rejected}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Последние акты</CardTitle>
                <CardDescription>Актуальный список актов на скрытые работы</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportToExcel}>
                  <Icon name="FileSpreadsheet" size={16} className="mr-2" />
                  Excel
                </Button>
                <Button variant="outline" onClick={exportToPDF}>
                  <Icon name="FileText" size={16} className="mr-2" />
                  PDF
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Создать акт
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Новый акт на скрытые работы</DialogTitle>
                    <DialogDescription>
                      Заполните данные и прикрепите фотофиксацию и сертификаты
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="act-number">Номер акта</Label>
                        <Input id="act-number" placeholder="АСР-004" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="act-date">Дата</Label>
                        <Input id="act-date" type="date" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project">Проект</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите проект" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="project1">ЖК "Новый горизонт"</SelectItem>
                          <SelectItem value="project2">ТЦ "Метрополис"</SelectItem>
                          <SelectItem value="project3">Бизнес-центр "Альфа"</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Наименование работ</Label>
                      <Input id="title" placeholder="Акт на скрытые работы по..." />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Описание</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Подробное описание выполненных работ"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Фотофиксация</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          id="photos"
                          onChange={(e) => setSelectedFiles(e.target.files)}
                        />
                        <label htmlFor="photos" className="cursor-pointer">
                          <Icon name="Upload" size={32} className="mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Загрузите фотографии</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG до 10MB</p>
                          {selectedFiles && (
                            <p className="text-xs text-primary mt-2">
                              Выбрано файлов: {selectedFiles.length}
                            </p>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Сертификаты</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id="certificates"
                        />
                        <label htmlFor="certificates" className="cursor-pointer">
                          <Icon name="FileUp" size={32} className="mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Загрузите сертификаты</p>
                          <p className="text-xs text-muted-foreground mt-1">PDF, DOC до 10MB</p>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Отмена
                      </Button>
                      <Button onClick={() => setIsDialogOpen(false)}>
                        Создать акт
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {acts.map((act) => (
                <Card 
                  key={act.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedAct(act);
                    setIsGalleryOpen(true);
                    setCurrentPhotoIndex(0);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-mono text-muted-foreground">{act.number}</span>
                          {getStatusBadge(act.status)}
                        </div>
                        <h3 className="font-semibold mb-1">{act.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Icon name="Folder" size={14} />
                          {act.project}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                          <Icon name="Calendar" size={14} />
                          {new Date(act.date).toLocaleDateString('ru-RU')}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon name="Image" size={12} />
                            {act.photos}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Award" size={12} />
                            {act.certificates}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
          <DialogContent className="max-w-5xl">
            {selectedAct && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedAct.number} - {selectedAct.title}</DialogTitle>
                  <DialogDescription>
                    {selectedAct.project} • {new Date(selectedAct.date).toLocaleDateString('ru-RU')}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {selectedAct.description && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm">{selectedAct.description}</p>
                    </div>
                  )}

                  {selectedAct.photoUrls && selectedAct.photoUrls.length > 0 && (
                    <div className="space-y-4">
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={selectedAct.photoUrls[currentPhotoIndex]}
                          alt={`Фото ${currentPhotoIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {selectedAct.photoUrls.length > 1 && (
                          <>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute left-4 top-1/2 -translate-y-1/2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentPhotoIndex((prev) => 
                                  prev === 0 ? selectedAct.photoUrls!.length - 1 : prev - 1
                                );
                              }}
                            >
                              <Icon name="ChevronLeft" size={20} />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute right-4 top-1/2 -translate-y-1/2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentPhotoIndex((prev) => 
                                  prev === selectedAct.photoUrls!.length - 1 ? 0 : prev + 1
                                );
                              }}
                            >
                              <Icon name="ChevronRight" size={20} />
                            </Button>
                            
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                              {currentPhotoIndex + 1} / {selectedAct.photoUrls.length}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-6 gap-2">
                        {selectedAct.photoUrls.map((url, index) => (
                          <div
                            key={index}
                            className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                              index === currentPhotoIndex 
                                ? 'border-primary scale-95' 
                                : 'border-transparent hover:border-primary/50'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentPhotoIndex(index);
                            }}
                          >
                            <img
                              src={url}
                              alt={`Превью ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Image" size={16} />
                        {selectedAct.photos} фото
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Award" size={16} />
                        {selectedAct.certificates} сертификатов
                      </span>
                    </div>
                    {getStatusBadge(selectedAct.status)}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}